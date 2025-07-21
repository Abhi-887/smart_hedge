<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Strategy>
 */
class StrategyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'name' => $this->faker->words(3, true) . ' Strategy',
            'description' => $this->faker->sentence(),
            'script_file' => null,
            'params_json' => json_encode([
                'risk_level' => $this->faker->randomElement(['low', 'medium', 'high']),
                'max_position_size' => $this->faker->numberBetween(1000, 50000),
                'stop_loss' => $this->faker->randomFloat(2, 0.01, 0.05),
            ]),
            'is_active' => $this->faker->boolean(70), // 70% chance of being active
            'is_public' => $this->faker->boolean(30), // 30% chance of being public
        ];
    }
}
